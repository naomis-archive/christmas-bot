export interface CharacterInt {
  name: string;
  image?: string;
  rareItem: string;
  uncomItem: string;
  comItem: string;
}

export const characters: CharacterInt[] = [
  {
    name: "nhcarrigan",
    rareItem: "RGB Computer Part",
    uncomItem: "Togepi Plushie",
    comItem: "Cup of Coffee",
  },
  {
    name: "bjorno",
    rareItem: "Overlord Throne",
    uncomItem: "Dutch book",
    comItem: "Image with hidden message",
  },
];
