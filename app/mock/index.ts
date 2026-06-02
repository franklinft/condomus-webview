import { Relations } from "@/shared/utils/relations";

export const mocks = {
  [Relations.GET_VISITORS_COUNT]: async () => {
    return 42;
  },

  [Relations.GET_VISITORS_SCHEDULES]: async () => {
    return [
      {
        id: '1',
        visitorName: 'João',
      },
    ];
  },
};
