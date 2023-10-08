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
  IconifyIconCustomisations,
  iconToHTML,
  iconToSVG,
} from '@iconify/utils';

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async css(prefix: string, query: JsonCssQueryDto, res: Response) {
    throw new NotFoundException();
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
}
