import React, { memo } from "react";
import { TileType, Value } from "../interfaces";

import "./Tile.scss";

interface TileProps {
  value: Value;
  type: TileType
  x: number;
  y: number;
}

const Tile = memo((props: TileProps) => {

  return (
    <div
      className={`tile tile-${props.value}`}
      style={{ transform: `translate(${props.x}px, ${props.y}px)` }}
    >
      <div className={`tileInner ${props.type}`}>{props.value}</div>
    </div>
  );
});

// Provide a display name to the memoized component
Tile.displayName = 'Tile';

export default Tile;
