import { drizzle } from "drizzle-orm/postgres-js/driver";
import { readFileSync } from "node:fs";
import path from "path";
import postgres from "postgres";
import { districtTable, provinceTable, wardTable } from "../db-schema";

type WardType = {
  Code: string;
  Name: string;
  NameEn: string;
  FullName: string;
  FullNameEn: string;
  CodeName: string;
  DistrictCode: string;
};

type DistrictType = {
  Code: string;
  Name: string;
  NameEn: string;
  FullName: string;
  FullNameEn: string;
  CodeName: string;
  ProvinceCode: string;
  Ward: WardType[];
};

type ProvinceType = {
  Code: string;
  Name: string;
  NameEn: string;
  FullName: string;
  FullNameEn: string;
  CodeName: string;
  District: DistrictType[];
};

type ProvincesDBType = ProvinceType[];

type DataType = { [x: string]: string }[];

const jsonConverter = (json: string) => JSON.parse(json);

function camelize(str: string) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

const templateJsonConverter = (json: string) => {
  const jsObj = jsonConverter(json) as ProvincesDBType;
  const convertedObj = jsObj.reduce(
    (
      prev: { provinces: DataType; districts: DataType; wards: DataType },
      curr
    ) => {
      let newDistrictList: DataType = [];
      let newWardList: DataType = [];

      const provinceObj = Object.entries(curr).reduce(
        (provincePrev, provinceCurr) => {
          if (provinceCurr[0] === "District") {
            (provinceCurr[1] as DistrictType[]).map((districtItem) => {
              const districtObj = Object.entries(districtItem).reduce(
                (districtPrev, districtCurr) => {
                  if (districtCurr[0] === "Ward") {
                    (districtCurr[1] as WardType[]).map((wardItem) => {
                      const wardObj = Object.entries(wardItem).reduce(
                        (wardPrev, wardCurr) => {
                          return {
                            ...wardPrev,
                            [camelize(wardCurr[0])]: wardCurr[1],
                          };
                        },
                        {}
                      );

                      newWardList.push(wardObj);
                    });

                    return { ...districtPrev };
                  }

                  return {
                    ...districtPrev,
                    [camelize(districtCurr[0])]: districtCurr[1],
                  };
                },
                {}
              );

              newDistrictList.push(districtObj);
            });

            return { ...provincePrev };
          }

          return {
            ...provincePrev,
            [camelize(provinceCurr[0])]: provinceCurr[1],
          };
        },
        {}
      );
      return {
        ...prev,
        provinces: [...prev.provinces, provinceObj],
        districts: [...prev.districts, ...newDistrictList],
        wards: [...prev.wards, ...newWardList],
      };
    },
    {
      provinces: [],
      districts: [],
      wards: [],
    }
  );
  return convertedObj;
};

const chunkArray = (arr: DataType, size: number = 30): DataType[] =>
  arr.length > size
    ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)]
    : [arr];

async function seed() {
  try {
    const client = postgres({
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
    });

    const db = drizzle(client, { logger: false });

    console.log("Seeding provinces database...");

    const data = templateJsonConverter(
      readFileSync(path.resolve("src/data/provinces-database.json"), "utf8")
    );

    if (data.provinces.length) {
      const list = await db.select().from(provinceTable).limit(1);
      if (list[0]) {
        await db.delete(provinceTable);
      }

      const chunkProvinceList = chunkArray(data.provinces);

      for (const chunkProvinces of chunkProvinceList) {
        await db
          .insert(provinceTable)
          .values(chunkProvinces)
          .execute()
          .catch(() => process.exit(1));
      }
    }

    if (data.districts.length) {
      const list = await db.select().from(districtTable).limit(1);
      if (list[0]) {
        await db.delete(districtTable);
      }

      const chunkDistrictList = chunkArray(data.districts);

      for (const chunkDistricts of chunkDistrictList) {
        await db
          .insert(districtTable)
          .values(chunkDistricts)
          .execute()
          .catch(() => process.exit(1));
      }
    }

    if (data.wards.length) {
      const list = await db.select().from(wardTable).limit(1);
      if (list[0]) {
        await db.delete(wardTable);
      }

      const chunkWardList = chunkArray(data.wards);

      for (const chunkWards of chunkWardList) {
        await db
          .insert(wardTable)
          .values(chunkWards)
          .execute()
          .catch(() => process.exit(1));
      }
    }

    console.log("done!");
    process.exit(0);
  } catch (error) {
    console.log("FATAL ERROR:", error);
  }
}

seed();
