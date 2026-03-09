---
title: Branch
description: Represent conversation forks, alternate paths, and decision branches inside a single Grain document.
---
# Branch

Conversation forks.

---

## Purpose

Show alternative responses, create conversation branches, enable A/B testing.

---

## Try it Live

<Playground />

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
   ↓        ↓         ↓
MERGED  COLLAPSED  MERGING → ACTIVE
```

---

## Events

| Event | Description |
|-------|-------------|
| `branch.create` | Branch created |
| `branch.expand` | User expanded |
| `branch.activate` | User switched to branch |
| `branch.merge` | Branch merged |

---

## Examples

### Two alternatives

```grain
<message role="assistant">
  <stream>I found two possible solutions:</stream>
</message>

<branch id="opt-1" label="Option A: Quick Fix" active="true">
  <message role="assistant">
    <stream>Quick but temporary solution...</stream>
  </message>
</branch>

<branch id="opt-2" label="Option B: Permanent Fix">
  <message role="assistant">
    <stream>Comprehensive solution...</stream>
  </message>
</branch>
```

### Nested branches

```grain
<branch id="main" label="Main Discussion" active="true">
  <message role="assistant">
    <stream>Main response...</stream>
  </message>
  
  <branch id="sub-1" label="Detail A">
    <message role="assistant">
      <stream>More details on A...</stream>
    </message>
  </branch>
</branch>
```

### Mergeable branch

```grain
<branch id="draft" label="Draft Response" mergeable="true">
  <message role="assistant">
    <stream>This is a draft that can be merged...</stream>
  </message>
</branch>
```

---

## Related

- [Artifact](/primitives/artifact) — Content display
- [Message](/primitives/overview) — Container
- [Playground](/playground) — Try it live
