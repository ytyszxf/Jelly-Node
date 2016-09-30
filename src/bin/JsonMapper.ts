declare const Reflect: any;
const jsonMetadataKey = "jsonProperty";

export function Serializable() {
  return function (clazz) { 
    clazz.deserialize = (obj: any): any => {
      return MapUtils.deserialize(clazz, obj);
    };

    clazz.prototype.serialize = function() {
      return MapUtils.serialize(this);
    };
  }
}

export interface ISerializable{
  serialize: ()=>any;
}

export function JsonProperty<T>(metadata?: IJsonMetaData<T> | string): any {
  if (metadata instanceof String || typeof metadata === "string") {
    return Reflect.metadata(jsonMetadataKey, {
      name: metadata,
      clazz: undefined
    });
  } else {
    let metadataObj = <IJsonMetaData<T>>metadata;
    return Reflect.metadata(jsonMetadataKey, {
      name: metadataObj ? metadataObj.name : undefined,
      clazz: metadataObj ? metadataObj.clazz : undefined
    });
  }
}


export class MapUtils {
  static isPrimitive(obj) {
    switch (typeof obj) {
      case "string":
      case "number":
      case "boolean":
        return true;
    }
    return !!(obj instanceof String || obj === String ||
      obj instanceof Number || obj === Number ||
      obj instanceof Boolean || obj === Boolean);
  }

  static getClazz(target: any, propertyKey: string): any {
    return Reflect.getMetadata("design:type", target, propertyKey)
  }

  static getJsonProperty<T>(target: any, propertyKey: string): IJsonMetaData<T> {
    return Reflect.getMetadata(jsonMetadataKey, target, propertyKey);
  }

  static serialize<T>(obj: Object) {
    let clazz = obj.constructor;
    let result = {};
    Object.keys(obj).forEach((key) => {
      let propertyMetadataFn: (IJsonMetaData) => any = (propertyMetadata) => {
        let innerJson = undefined;
        innerJson = obj ? obj[key] : undefined;
        let clazz = MapUtils.getClazz(obj, key);
        if (!MapUtils.isPrimitive(clazz)) {
          if (MapUtils.isArray(obj[key])) {
            return obj[key].map((item) => {
              return MapUtils.serialize(item);
            });
          } else {
            return MapUtils.serialize(obj[key]);
          }
        } else {
          return obj ? obj[key] : undefined;
        }
      };

      let propertyMetadata: IJsonMetaData<T> = MapUtils.getJsonProperty<T>(obj, key);
      if (propertyMetadata) {
        let propertyName = propertyMetadata.name || key;
        result[propertyName] = propertyMetadataFn(propertyMetadata);
      } else {
        if (obj && obj[key] !== undefined) {
          result[key] = obj[key];
        }
      }
    });
    return result;
  }

  static deserialize<T>(clazz: { new (): T }, jsonObject) {
    if ((clazz === undefined) || (jsonObject === undefined)) return undefined;
    let obj = new clazz();
    Object.keys(obj).forEach((key) => {
      let propertyMetadataFn: (IJsonMetaData) => any = (propertyMetadata) => {
        let propertyName = propertyMetadata.name || key;
        let innerJson = jsonObject ? jsonObject[propertyName] : undefined;
        let clazz = MapUtils.getClazz(obj, key);
        if (MapUtils.isArray(clazz)) {
          let metadata = MapUtils.getJsonProperty(obj, key);
          if (metadata.clazz || MapUtils.isPrimitive(clazz)) {
            if (innerJson && MapUtils.isArray(innerJson)) {
              return innerJson.map(
                (item) => MapUtils.deserialize(metadata.clazz, item)
              );
            } else {
              return undefined;
            }
          } else {
            return innerJson;
          }
        } else if (!MapUtils.isPrimitive(clazz)) {
          return MapUtils.deserialize(clazz, innerJson);
        } else {
          return jsonObject ? jsonObject[propertyName] : undefined;
        }
      };

      let propertyMetadata = MapUtils.getJsonProperty(obj, key);
      if (propertyMetadata) {
        obj[key] = propertyMetadataFn(propertyMetadata);
      } else {
        if (jsonObject && jsonObject[key] !== undefined) {
          obj[key] = jsonObject[key];
        }
      }
    });
    return obj;
  }

  static isArray(object) {
    if (object === Array) {
      return true;
    } else if (typeof Array.isArray === "function") {
      return Array.isArray(object);
    }
    else {
      return !!(object instanceof Array);
    }
  }
}

export interface IJsonMetaData<T> {
  name?: string,
  clazz?: { new (): T }
}

