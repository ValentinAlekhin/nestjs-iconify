import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { toBoolean, toNumber, toStringArray } from '../helpers/transformers';

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
