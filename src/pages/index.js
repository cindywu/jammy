import React, {useEffect, useRef, useState} from 'react';
import {Replicache} from 'replicache';
import {useSubscribe} from 'replicache-react';
import {nanoid} from 'nanoid';

export default function Home() {
  const [rep, setRep] = useState(null);

  useEffect(() => {
    (async () => {
      const rep = new Replicache({
        name: 'chat-user-id',
        licenseKey: 'l077f51b26f854f218b25a96e2e29b9eb',
        pushURL: '/api/replicache-push',
        pullURL: '/api/replicache-pull',
        mutators: {
          async createMessage(tx, {id, from, content, order}) {
            await tx.put(`message/${id}`, {
              from,
              content,
              order,
            });
          },
        },
      });
    listen(rep);
    setRep(rep);
    })()
  }, [])

  return rep && <Chat rep={rep} />;
}



function Chat({rep}) {
  const messages = useSubscribe(
    rep,
    async tx => {
      // Note: Replicache also supports secondary indexes, which can be used
      // with scan. See:
      // https://js.replicachedev/classes/replicache.html#createindex
      const list = await tx.scan({prefix: 'message/'}).entries().toArray();
      list.sort(([, {order: a}], [, {order: b}]) => a - b);
      return list;
    },
    [],
  );

  const usernameRef = useRef();
  const contentRef = useRef();

  const onSubmit = e => {
    e.preventDefault();
    const last = messages.length && messages[messages.length -1][1]
    const order = (last?.order ?? 0 ) + 1;
    rep.mutate.createMessage({
      id: nanoid(),
      from: usernameRef.current.value,
      content: contentRef.current.value,
      order,
    });
    contentRef.current.value = '';
  }

  return (
    <div className="flex flex-col p-4">
      <form className="flex flex-row mb-2 shrink-0" onSubmit={onSubmit}>
        <input ref={usernameRef} className="flex shrink-0 mr-2 border" required />
        says:
        <input ref={contentRef} className="flex-1 max-w-xl my-0 mx-2 border" required />
        <input className="bg-blue-400 px-2" type="submit" />
      </form>
      <MessageList messages={messages} />
    </div>
  );
}

function MessageList({messages}) {
  return messages.map(([k, v]) => {
    return (
      <div key={k}>
        <b>{v.from}: </b>
        {v.content}
      </div>
    );
  });
}


function listen(rep) {
  // TODO: Listen for changes on server
}