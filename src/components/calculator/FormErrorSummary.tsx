export function FormErrorSummary({ messages }: { messages: Array<string | undefined> }) {
  const uniqueMessages = Array.from(new Set(messages.filter((message): message is string => Boolean(message))));
  if (!uniqueMessages.length) return null;

  return (
    <div role="alert" className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      <strong className="block font-bold">입력값을 확인해 주세요.</strong>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {uniqueMessages.map((message) => <li key={message}>{message}</li>)}
      </ul>
    </div>
  );
}
