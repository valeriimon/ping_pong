export interface ElementSize {
  width: number,
  height: number
}

export interface GameControllerEntity extends ElementSize {
  posY: number,
  update(options: GameControllerEntity): void
}

export interface GameControllerSettingsExtended {
  ctx: CanvasRenderingContext2D,
  posX: number,
  gameTopBorder: number,
  gameBottomBorder: number,
  width: number,
  height: number,
  upKey: number,
  downKey: number,
  collisionFn: (ballX: number, ballY: number, ballRadius: number) => boolean
}

export interface ControllerSettings {
  bgColor: string,
  width: number,
  height: number,
  upKey: number,
  downKey: number
}

export type GameControllerSettings = ControllerSettings & GameControllerSettingsExtended