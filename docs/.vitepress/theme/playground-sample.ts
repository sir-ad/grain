export const DEFAULT_PLAYGROUND_CODE = `<message role="assistant">
  <think model="chain-of-thought" visible="false">
    The user wants a weather update for Mumbai.
  </think>
  <stream>Checking Mumbai weather...</stream>
</message>

<tool name="get_weather" args='{"city":"Mumbai"}' status="running">
  <input>City: Mumbai</input>
  <progress value="45" max="100">Fetching live conditions</progress>
</tool>

<tool name="get_weather" status="complete">
  <result temperature="28" condition="sunny" humidity="65" />
</tool>

<message role="assistant">
  <stream>It is 28°C and sunny in Mumbai.</stream>
</message>`;
