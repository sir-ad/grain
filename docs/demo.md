---
title: Demo | Grain
description: Live demo of Grain Language in action - Code Assistant, Research Agent, and Data Analysis scenarios.
---

# Live Demo

<Playground />

See Grain Language in action with real-world AI scenarios.

---

## Code Assistant Scenario

AI helps debug code, makes changes, and asks for approval before applying.

<div class="demo-message" id="demo-code">
```grain
<message role="assistant">
  <think model="chain-of-thought" visible="true">
    Analyzing the user's code for bugs...
    Found: uninitialized variable on line 5
    Found: potential null pointer on line 12
  </think>

  <stream speed="fast">I found 2 issues in your code:</stream>

  <artifact type="code" language="typescript" title="fixed.ts">
    // Fixed version
    const data = initializeData();
    const result = process(data ?? []);
  </artifact>

  <approve type="action" action="Apply changes to file">
    <warning>This will modify src/utils.ts</warning>
    <option label="Cancel"></option>
    <option label="Apply" primary></option>
  </approve>
</message>
```
</div>

**Key Primitives Used:**
- `<think>` — Shows AI reasoning process
- `<stream>` — Real-time text output
- `<artifact>` — Code block with syntax highlighting
- `<approve>` — Human-in-the-loop confirmation

---

## Research Agent Scenario

Agent searches web, analyzes multiple sources, presents findings with branches.

<div class="demo-message" id="demo-research">
```grain
<message role="assistant">
  <tool name="web_search" args='{"q": "quantum computing 2024"}' status="complete">
    <result found="15"></result>
  </tool>

  <stream>Based on my research, here are the key findings:</stream>

  <branch id="main" label="Summary" active="true">
    <stream>Quantum computing has made significant progress in 2024...</stream>
  </branch>

  <branch id="tech" label="Technical Details">
    <artifact type="code" language="python">
      # Qubit coherence improvements
      improved_qubits = new_architecture()
    </artifact>
  </branch>
</message>
```
</div>

**Key Primitives Used:**
- `<tool>` — External function execution
- `<branch>` — Alternative responses/forks
- `<artifact>` — Structured content display

---

## Data Analysis Scenario

Agent processes data, generates charts, shows progress indicators.

<div class="demo-message" id="demo-data">
```grain
<message role="assistant">
  <state status="streaming" progress="65" message="Processing data..." />

  <stream>Here's your data analysis:</stream>

  <artifact type="chart" title="Monthly Revenue">
    {"type": "bar", "data": [120, 150, 180, 220]}
  </artifact>

  <context type="file" id="data-1" name="analysis.csv" size="45000" />
</message>
```
</div>

**Key Primitives Used:**
- `<state>` — Global status indicator
- `<artifact type="chart">` — Data visualization
- `<context>` — File/data attachment reference

---

## More Examples

| Scenario | Primitives | Complexity |
|----------|------------|------------|
| Chat Bot | `<message>`, `<stream>` | Basic |
| Code Assistant | `<think>`, `<artifact>`, `<approve>` | Intermediate |
| Research Agent | `<tool>`, `<branch>`, `<context>` | Advanced |
| Data Pipeline | `<state>`, `<artifact type="chart">` | Advanced |

---

## Try It Yourself

Head to the [Playground](/playground) to experiment with these scenarios.

---

## Related

- [Playground](/playground)
- [Examples Guide](/guide/examples)
- [Primitives Reference](/primitives/overview)
