
export interface IDevices {
    type: string;
    name: string;
    id: string;
}

export interface ILightDevice extends IDevices {
    rgb: boolean;
    brightness: number;
}