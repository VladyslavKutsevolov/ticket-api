export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation((subject, data: string, callback: () => void) => {
        callback();
      }),
  },
};
