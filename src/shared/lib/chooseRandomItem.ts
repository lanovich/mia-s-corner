export const chooseRandomItem = (
  data: { category_slug: string; slug: string }[] | null
) => {
  if (data) {
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
  } else {
    return {
      category_slug: "aroma-duffusers",
      slug: "ona-vlyubilasь-v-prostaka",
    };
  }
};
