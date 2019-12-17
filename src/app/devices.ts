
export interface IDevice {
    /*id: string;*/
    type: string;
    name?: string;
}

export interface ILightDevice extends IDevice {
    rgb: boolean;
    brightness: number;
}