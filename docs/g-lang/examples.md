# G-Lang Examples

Real-world examples.

---

## Simple Chat

```grain
<message role="user">Hello</message>

<message role="assistant">
  <stream>Hi! How can I help?</stream>
</message>
```

---

## Tool Call Flow

```grain
<message role="user">What's the weather in Mumbai?</message>

<tool name="get_weather" args='{"city": "Mumbai"}' status="running">
  <input>City: Mumbai</input>
</tool>

<tool name="get_weather" status="complete">
  <result temperature="28" condition="sunny" humidity="65" />
</tool>

<message role="assistant">
  <stream>It's 28°C and sunny in Mumbai!</stream>
</message>
```

---

## With Reasoning

```grain
<message role="assistant">
  <think model="chain-of-thought" visible="false">
    The user is asking about weather in Mumbai.
    I should call the weather API to get current conditions.
    Then provide a friendly response with the temperature.
  </think>
  <stream>Let me check the weather for you...</stream>
</message>
```

---

## Code Artifact

```grain
<message role="assistant">
  <stream>Here's a quick sort implementation:</stream>
  <artifact type="code" language="javascript" title="quicksort.js" 
           copyable="true" downloadable="true">
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[arr.length - 1];
  const left = arr.filter((el, i) => el < pivot && i < arr.length - 1);
  const right = arr.filter((el, i) => el >= pivot && i < arr.length - 1);
  
  return [...quickSort(left), pivot, ...quickSort(right)];
}
  </artifact>
</message>
```

---

## Approval Flow

```grain
<tool name="send_email" args='{"to": "user@example.com"}' status="pending" mode="manual">
  <input>To: user@example.com</input>
  <input>Subject: Hello</input>
</tool>

<approve type="tool_call" action="Send email to user@example.com" 
         warning="This will send an email to an external address">
  <option label="Cancel"></option>
  <option label="Send Email"></option>
</approve>
```

---

## Error Recovery

```grain
<error code="RATE_LIMIT" message="Too many requests. Please wait 30 seconds." recoverable="true">
  <action name="retry" label="Retry Now" />
  <action name="cancel" label="Cancel" />
</error>
```

---

## With Context

```grain
<message role="user">Summarize this document.</message>

<context type="file" id="doc-123" name="annual-report.pdf" 
         size="2048000" mimeType="application/pdf" />

<tool name="extract_text" args='{"file_id": "doc-123"}' status="running" />

<message role="assistant">
  <tool name="extract_text" status="complete">
    <result>Extracted 45 pages of text...</result>
  </tool>
  <stream>Based on the annual report, revenue increased by 23%...</stream>
</message>
```

---

## Multiple Branches

```grain
<message role="assistant">
  <stream>Here are three solutions:</stream>
</message>

<branch id="branch-1" label="Recursive">
  <artifact type="code">function fib(n) {
  if (n <= 1) return n;
  return fib(n-1) + fib(n-2);
}</artifact>
</branch>

<branch id="branch-2" label="Iterative">
  <artifact type="code">function fib(n) {
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}</artifact>
</branch>

<branch id="branch-3" label="Memoization">
  <artifact type="code">const memo = {};
function fib(n) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  return memo[n] = fib(n-1) + fib(n-2);
}</artifact>
</branch>
```

---

## Full Chat Example

```grain
<message role="user">Help me write a function to sort arrays.</message>

<state status="thinking" message="Processing request..." />

<message role="assistant">
  <think model="chain-of-thought" visible="false">
    User wants a sorting function. I'll provide multiple approaches: quick sort, merge sort, and built-in.
  </think>
  <stream>Here are a few sorting approaches in JavaScript:</stream>
  
  <artifact type="code" language="javascript" title="sort.js">
// Quick Sort
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[arr.length - 1];
  const left = arr.filter((el, i) => el < pivot && i < arr.length - 1);
  const right = arr.filter((el, i) => el >= pivot && i < arr.length - 1);
  return [...quickSort(left), pivot, ...quickSort(right)];
}

// Built-in
arr.sort((a, b) => a - b);
  </artifact>
  
  <actions>
    <action name="copy" label="Copy" />
    <action name="explain" label="Explain Code" />
  </actions>
</message>
```
