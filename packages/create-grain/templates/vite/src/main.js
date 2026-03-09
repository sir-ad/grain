import { WebAdapter } from '@grain.sh/web';

const adapter = new WebAdapter();
adapter.registerCustomElements();

const app = document.getElementById('app');

adapter.render(
  `<message role="assistant">
    <stream>Welcome to Grain. Your web adapter is wired and ready.</stream>
  </message>
  <tool name="bootstrap" status="complete">
    <result package="@grain.sh/web" template="vite" />
  </tool>`,
  { container: app }
);
