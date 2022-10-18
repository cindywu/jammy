import {db} from '../../../datamodel/db.js';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  const push = req.body;
  console.log('Processing push', JSON.stringify(push));

  const t0 = Date.now();
  try {
    await db.tx(async t => {
      const {nextval: version} = await t.one("SELECT nextval('version')");
      let lastMutationID = await getLastMutationID(t, push.clientID);

      console.log('version', version, 'lastMutationID:', lastMutationID);

      for (const mutation of push.mutations) {
        const t1 = Date.now();

        const expectedMutationID = lastMutationID + 1;

        if (mutation.id < expectedMutationID) {
          console.log(
            `Mutation ${mutation.id} has already been processed - skipping`,
          );
          continue;
        }
        if (mutation.id > expectedMutationID) {
          console.warn(`Mutation ${mutation.id} is from the future - aborting`);
          break;
        }

        console.log('Processing mutation:', JSON.stringify(mutation));

        switch (mutation.name) {
          case 'createMessage':
            await createMessage(t, mutation.args, version);
            break;
          default:
            throw new Error(`Unknown mutation: ${mutation.name}`);
        }

        lastMutationID = expectedMutationID;
        console.log('Processed mutation in', Date.now() - t1);
      }

      console.log(
        'setting',
        push.clientID,
        'last_mutation_id to',
        lastMutationID,
      );
      await t.none(
        'UPDATE replicache_client SET last_mutation_id = $2 WHERE id = $1',
        [push.clientID, lastMutationID],
      );
      res.send('{}');
    });

    // We need to await here otherwise, Next.js will frequently kill the request
    // and the poke won't get sent.
    await sendPoke();
  } catch (e) {
    console.error(e);
    res.status(500).send(e.toString());
  } finally {
    console.log('Processed push in', Date.now() - t0);
  }
};

async function getLastMutationID(t, clientID) {
  const clientRow = await t.oneOrNone(
    'SELECT last_mutation_id FROM replicache_client WHERE id = $1',
    clientID,
  );
  if (clientRow) {
    return parseInt(clientRow.last_mutation_id);
  }

  console.log('Creating new client', clientID);
  await t.none(
    'INSERT INTO replicache_client (id, last_mutation_id) VALUES ($1, 0)',
    clientID,
  );
  return 0;
}

async function createMessage(t, {id, from, content, order}, version) {
  await t.none(
    `INSERT INTO message (
    id, sender, content, ord, version) values
    ($1, $2, $3, $4, $5)`,
    [id, from, content, order, version],
  );
}

async function sendPoke() {
  // TODO
}