
// abstract class Device<T> {
//   payload: T;
//   constructor(payload?: T) {
//     if (payload) {
//       this.payload = payload;
//     }
//   }
//   protected abstract updateState<T>(payload: T);
// }

export class IDevice {
  constructor(
    public name?: string,
    public type?: string ) { }
}

// export interface IDevice {
//     type?: string;
//     name?: string;
// }

export class BaseDevice implements IDevice {
  public name: string;
  public type: string;
  constructor(name: string = "", type: string = "", payload?: IDevice) {
    if(payload) {
      this.name = payload.name;
      this.type = payload.type;
    } else {
      this.name = name;
      this.type = type;
    }
  }

  updateState(payload: IDevice) {

    if (payload.hasOwnProperty("type")) {
      this.type = payload.type;
    }

    if (payload.hasOwnProperty("name")) {
      this.name = payload.name;
    }
  }

}


export class ILightDevice extends IDevice {
  constructor(
    public name?: string,
    public type?: string,
    public on_state?: boolean,
    public brightness?: number,
    public rgb?: boolean) {
    super(name, type);
  }
}

// export interface ILightDevice extends IDevice {
//     on_state?: boolean;
//     rgb?: boolean;
//     brightness?: number;
// }

export class LightDevice extends BaseDevice implements ILightDevice {
  public name: string;
  public type: string;
  public on_state: boolean;
  public brightness: number;
  public rgb: boolean;
  on: (event: string | symbol, listener: (...args: any[]) => void) => LightDevice;

  updateState(payload: ILightDevice) {
    
    super.updateState(payload);

    if (payload.hasOwnProperty("on_state")) {
      this.on_state = payload.on_state;
    }

    if (payload.hasOwnProperty("brightness")) {
      this.brightness = payload.brightness;
    }

    if (payload.hasOwnProperty("rgb")) {
      this.rgb = payload.rgb;
    }
  }
}