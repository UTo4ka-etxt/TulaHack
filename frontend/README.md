### 1. Создание структуры проекта

1. Перейдите в корневую папку вашего проекта `planer`.
2. Создайте папку `frontend`:

   ```bash
   mkdir frontend
   cd frontend
   ```

3. Инициализируйте новый проект с помощью `npm`:

   ```bash
   npm init -y
   ```

### 2. Установка необходимых зависимостей

Установите необходимые библиотеки для работы с React и взаимодействия с вашим бэкендом:

```bash
npm install react react-dom axios
```

Если вы планируете использовать React Router для навигации, установите его:

```bash
npm install react-router-dom
```

### 3. Создание структуры папок

Создайте структуру папок для вашего фронтенда:

```bash
mkdir src
cd src
mkdir components pages
```

### 4. Создание базового приложения React

Создайте файл `index.js` в папке `src`:

```javascript
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
```

Создайте файл `App.js` в папке `src`:

```javascript
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        {/* Добавьте другие маршруты здесь */}
      </Switch>
    </Router>
  );
};

export default App;
```

Создайте файл `Home.js` в папке `pages`:

```javascript
// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/data'); // Замените на ваш URL
        setData(response.data);
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Главная страница</h1>
      <ul>
        {data.map(item => (
          <li key={item.id}>{item.name}</li> // Замените на ваши поля
        ))}
      </ul>
    </div>
  );
};

export default Home;
```

### 5. Настройка сборки

Создайте файл `webpack.config.js` в корне папки `frontend` для настройки сборки (если вы используете Webpack):

```javascript
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },
};
```

### 6. Запуск приложения

Добавьте скрипты в ваш `package.json` для запуска приложения:

```json
"scripts": {
  "start": "webpack serve --mode development",
  "build": "webpack --mode production"
}
```

Теперь вы можете запустить ваше приложение:

```bash
npm start
```

### 7. Связывание с бэкендом

Убедитесь, что ваш бэкенд запущен и доступен по указанному URL (например, `http://localhost:5000/api/data`). Теперь ваше приложение должно успешно связываться с функциональностью из папки `backend`.

### Заключение

Теперь у вас есть базовая структура проекта, которая связывает функциональность бэкенда с визуальным интерфейсом. Вы можете расширять функциональность, добавляя новые компоненты и страницы по мере необходимости.