import { accountabilityQueue } from "./accountabilityQueue.js";
const run = async () => {
  console.log(" About to add job...");
  const job = await accountabilityQueue.add('reminder', {
    AccountabilityId: 'test-123'
  });
  console.log(' Job added to queue:', job.id);
};

run();
