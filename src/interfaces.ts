export interface ElementSize {
  width: number,
  height: number
}

export interface GameControllerEntity extends ElementSize {
  posY: number,
  update(options: GameControllerEntity): void
}