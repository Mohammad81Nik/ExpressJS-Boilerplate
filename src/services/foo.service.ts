export const fooService = {
  create(data: { name: string }) {
    return {
      id: Date.now(),
      ...data,
    };
  },
};
