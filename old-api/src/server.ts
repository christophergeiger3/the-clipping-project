import App from '@/app';
import AnalyzeRoute from '@routes/analyze.route';
import AuthRoute from '@routes/auth.route';
import ClipsRoute from '@routes/clips.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new ClipsRoute(), new AnalyzeRoute()]);

app.listen();
