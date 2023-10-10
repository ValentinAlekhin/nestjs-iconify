import { Injectable, NotFoundException } from '@nestjs/common';
import { lookupCollection, lookupCollections } from '@iconify/json';
import {
  CollectionQueryDto,
  JsonCssQueryDto,
  LastModifiedQueryDto,
  SvgQueryDto,
} from './iconify-core.dto';
import { omit } from 'lodash';
import { capitalCase } from 'change-case';
import { Response } from 'express';
import {
  defaultIconCustomisations,
  defaultIconDimensions,
  flipFromString,
  getIconsCSS,
  IconifyIconCustomisations,
  iconToHTML,
  iconToSVG,
  stringToColor,
} from '@iconify/utils';
import { IconCSSIconSetOptions } from '@iconify/utils/lib/css/types';

@Injectable()
export class IconifyCoreService {
  constructor() {}

  async collections() {
    return lookupCollections();
  }

  async collection(query: CollectionQueryDto) {
    const data = await this.findByPrefix(query.prefix, true);

    const total = Object.keys(data.icons).length;

    let response = omit(data, 'icons', 'width', 'height');

    if (!query.info) {
      response = omit(response, 'info');
    }

    return {
      ...response,
      total,
      title: capitalCase(response.prefix),
    };
  }

  async lastModified(query: LastModifiedQueryDto) {
    if (!query.prefix && !query.prefixes) {
      return {};
    }

    if (query.prefix) {
      const data = await this.findByPrefix(query.prefix);
      if (data) {
        return {
          [query.prefix]: data.lastModified,
        };
      }

      return {};
    }

    if (query.prefixes.length) {
      const data = await this.findManyByPrefixes(query.prefixes);
      const collections = await Promise.all(
        data.map((c) => lookupCollection(c.prefix)),
      );
      return collections.reduce((acc, value) => {
        acc[value.prefix] = value.lastModified;
        return acc;
      }, {});
    }
  }

  async css(prefix: string, query: JsonCssQueryDto, res: Response) {
    const iconSet = await this.findByPrefix(prefix, true);

    const options: IconCSSIconSetOptions = {};
    const qOptions = query as IconCSSIconSetOptions;

    if (typeof qOptions.format === 'string') {
      options.format = query.format;
    }

    const color = qOptions.color;
    if (typeof color === 'string' && stringToColor(color)) {
      options.color = color;
    }

    const mode = qOptions.mode;
    if (mode) {
      switch (mode) {
        case 'background':
        case 'mask':
          options.mode = mode;
          break;

        default:
          if ((mode as string) === 'bg') {
            options.mode = 'background';
          }
      }
    }

    const forceSquare =
      query.square || query.forceSquare || query['force-square'];
    if (typeof forceSquare === 'boolean') {
      options.forceSquare = forceSquare;
    }

    const pseudoSelector =
      query.pseudo || query.pseudoSelector || query['pseudo-selector'];
    if (typeof pseudoSelector === 'boolean') {
      options.pseudoSelector = pseudoSelector;
    }

    const commonSelector = qOptions.commonSelector || query.common;
    if (this.checkSelector(commonSelector)) {
      options.commonSelector = commonSelector;
    }

    const iconSelector = qOptions.iconSelector || query.selector;
    if (this.checkSelector(iconSelector)) {
      options.iconSelector = iconSelector;
    }

    const overrideSelector = qOptions.overrideSelector || query.override;
    if (this.checkSelector(overrideSelector)) {
      options.overrideSelector = overrideSelector;
    }

    const varName = query.varName || query.var;
    if (typeof varName === 'string' && varName.match(/^[a-z0-9_-]*$/)) {
      if (!varName || varName === 'null' || query.varName) {
        options.varName = null;
      } else {
        options.varName = varName;
      }
    }

    const css = getIconsCSS(iconSet, query.icons, options);

    if (query.download) {
      res.header(
        'Content-Disposition',
        'attachment; filename="' + prefix + '.css"',
      );
    }

    res.type('text/css; charset=utf-8').send(css);
  }
  async json(prefix: string, query: JsonCssQueryDto, res: Response) {
    const data = await this.findByPrefixAndIcons(prefix, query.icons);
    return res.json(omit(data, 'info', 'categories'));
  }

  async svg(prefix: string, name: string, query: SvgQueryDto, res: Response) {
    const iconSetItem = await this.findIconByPrefixAndName(prefix, name, true);

    const customisations: IconifyIconCustomisations = {};
    customisations.width = query.width || defaultIconCustomisations.width;
    customisations.height = query.height || defaultIconCustomisations.height;
    customisations.rotate = query.rotate || 0;

    if (query.flip) {
      flipFromString(customisations, query.flip);
    }

    const svg = iconToSVG(iconSetItem, customisations);

    let body = svg.body;
    if (query.box) {
      // Add bounding box
      body =
        '<rect x="' +
        (iconSetItem.left || 0) +
        '" y="' +
        (iconSetItem.top || 0) +
        '" width="' +
        (iconSetItem.width || defaultIconDimensions.width) +
        '" height="' +
        (iconSetItem.height || defaultIconDimensions.height) +
        '" fill="rgba(255, 255, 255, 0)" />' +
        body;
    }
    let html = iconToHTML(body, svg.attributes);

    const color = query.color;
    if (
      color &&
      html.indexOf('currentColor') !== -1 &&
      color.indexOf('"') === -1
    ) {
      html = html.split('currentColor').join(color);
    }

    if (query.download) {
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="' + name + '.svg"',
      );
    }
    res.type('image/svg+xml; charset=utf-8').send(html);
  }

  private findByPrefix(prefix: string, error = false) {
    try {
      return lookupCollection(prefix);
    } catch (e) {
      if (!error) {
        throw new NotFoundException();
      }
      return null;
    }
  }

  private async findManyByPrefixes(prefixes: string[]) {
    const data = await lookupCollections();

    return Object.entries(data)
      .filter(([key]) => prefixes.includes(key))
      .map(([prefix, value]) => ({ ...value, prefix }));
  }

  private async findByPrefixAndIcons(prefix: string, iconsArr: string[]) {
    const data = await this.findByPrefix(prefix, true);

    const filter = (obj: Record<string, any>, list: string[]) =>
      Object.entries(obj)
        .filter(([key]) => list.includes(key))
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

    const aliases = filter(data.aliases, iconsArr);

    const aliasesList = Object.values(aliases).map((a: any) => a.parent);
    const icons = filter(data.icons, [...iconsArr, ...aliasesList]);

    return { ...data, icons, aliases };
  }

  private async findIconByPrefixAndName(
    prefix: string,
    name: string,
    error = false,
  ) {
    const data = await this.findByPrefixAndIcons(prefix, [name]);
    const icon = Object.values(data.icons)[0] as { body: string };

    if (!icon && error) throw new NotFoundException();

    const width = data.width || 16;
    const height = data.height || width;
    const left = data.left || 0;
    const top = data.top || 0;

    return { ...icon, width, height, left, top };
  }

  private checkSelector(value: string | undefined): boolean {
    if (typeof value !== 'string') {
      return false;
    }
    const cleanValue = value
      .replaceAll('{name}', '')
      .replaceAll('{prefix}', '');
    return cleanValue.indexOf('{') === -1 && cleanValue.indexOf('}') === -1;
  }
}
