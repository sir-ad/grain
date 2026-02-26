# Branch

Conversation forks.

---

## Purpose

Show alternative responses, create conversation branches, enable A/B testing.

---

## G-Lang

```grain
<branch id="alt-1" label="Alternative: Recursive Solution" active="true">
  <message role="assistant">
    <artifact type="code" language="javascript">
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
    </artifact>
  </message>
</branch>

<branch id="alt-2" label="Alternative: Iterative Solution">
  <message role="assistant">
    <artifact type="code" language="javascript">
function factorial(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}
    </artifact>
  </message>
</branch>
```

---

## Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | string | Unique branch ID |
| `label` | string | Branch label |
| `active` | `true` \| `false` | Is active branch |
| `mergeable` | `true` \| `false` | Can merge |
| `parent` | string | Parent branch ID |

---

## States

```
CREATED → EXPANDED → ACTIVE
    ↓         ↓         ↓
  MERGED   COLLAPSED   MERGING → ACTIVE
```

---

## Events

| Event | Description |
|-------|-------------|
| `branch.create` | Branch created |
| `branch.expand` | User expanded |
| `branch.activate` | User switched to branch |
| `branch.merge` | Branch merged |
