export default interface Ship {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: shipType;
}

type shipType = 'small' | 'medium' | 'large' | 'huge';
