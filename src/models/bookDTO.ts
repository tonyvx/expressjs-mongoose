import { Expose } from "class-transformer";
import { IsDefined, IsNumber, Max, Min, MinLength } from "class-validator";

export class BookDTO {
  @IsDefined()
  @Expose()
  @MinLength(4)
  title!: string;

  @IsDefined()
  @Expose()
  // @Matches(RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
  @MinLength(4)
  author!: string;

  @IsDefined()
  @IsNumber()
  @Expose()
  @Min(1)
  year!: number;

  @IsDefined()
  @IsNumber()
  @Expose()
  @Min(1)
  pages!: number;
}

