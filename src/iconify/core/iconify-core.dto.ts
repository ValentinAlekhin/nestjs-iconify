import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { toBoolean, toStringArray } from '../../helpers/transformers';
import { toNumber } from 'lodash';

export enum CssQueryModeType {
  MASK = 'mask',
  BACKGROUND = 'background',
}

export enum CssQueryFormatType {
  EXPANDED = 'expanded',
  COMPACT = 'compact',
  COMPRESSED = 'compressed',
}

export class CollectionQueryDto {
  @IsString()
  @IsNotEmpty()
  prefix: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  info: boolean = false;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  chars: boolean = false;
}

export class LastModifiedQueryDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  prefix: string;

  @IsArray()
  @IsOptional()
  @Transform(({ value }) => toStringArray(value))
  prefixes: string[];
}

export class JsonCssQueryDto {
  @IsArray()
  @Transform(({ value }) => toStringArray(value))
  icons: string[];

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  download: boolean;

  @IsString()
  @IsOptional()
  iconSelector: string;

  @IsString()
  @IsOptional()
  selector: string;

  @IsString()
  @IsOptional()
  commonSelector: string;

  @IsString()
  @IsOptional()
  common: string;

  @IsString()
  @IsOptional()
  overrideSelector: string;

  @IsString()
  @IsOptional()
  override: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  pseudoSelector: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  pseudo: boolean;

  @IsString()
  @IsOptional()
  varName: string;

  @IsString()
  @IsOptional()
  var: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  forceSquare: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  square: boolean;

  @IsString()
  @IsOptional()
  color: string;

  @Transform(({ value }) => ('' + value).toLowerCase())
  @IsEnum(CssQueryModeType)
  @IsOptional()
  mode: CssQueryModeType;

  @Transform(({ value }) => ('' + value).toLowerCase())
  @IsEnum(CssQueryFormatType)
  @IsOptional()
  format: CssQueryFormatType;
}

export class SvgQueryDto {
  @IsString()
  @IsOptional()
  color: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => toNumber(value))
  width: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => toNumber(value))
  height: number;

  @IsString()
  @IsOptional()
  flip: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => toNumber(value))
  rotate: number;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  download: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  box: boolean;
}
