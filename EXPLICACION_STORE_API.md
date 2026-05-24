# Explicacion del store con Axios

Este documento explica como se ha conectado el frontend Nuxt/Vue 2 con las rutas HTTP del backend Laravel usando `store/` y `axios`.

## Criterio de nombres

Los datos del frontend usan los mismos nombres que el backend para evitar conversiones dentro del store.

Campos principales:

```txt
Game: id, name, image, isActive, isFavorite
User: id, nickname, mail, level, general_xp, isAdmin
```

Antes habia una traduccion entre nombres en espanol y nombres del backend. Esa capa se elimino. Ahora las paginas, dialogos y stores trabajan directamente con los nombres en ingles.

## Configuracion general

En `package.json` se anadio:

```json
"axios": "^1.16.1"
```

La URL base esta en `.env`:

```env
API_BASE_URL=http://localhost:8080/api
```

Tambien existe `.env.example` con la misma clave para documentar la configuracion necesaria.

Los stores leen la URL base asi:

```js
const baseUrl = process.env.API_BASE_URL
```

No hay fallback en el codigo: si falta `API_BASE_URL`, se debe corregir el `.env`.

## Estilo de peticiones

Las peticiones siguen el estilo del archivo de referencia `Proyecto-Onboarding/Frontend/store/database.js`:

```js
import axios from 'axios'

const baseUrlGames = `${baseUrl}/games`

let response = null
response = await axios.get(baseUrlGames)
return response
```

La idea es que cada accion Vuex sea directa:

1. Se declara `response`.
2. Se ejecuta la llamada HTTP con `axios`.
3. Se guarda el resultado con `commit`.
4. Se devuelve `response`.

## Cabecera de autenticacion

Las rutas protegidas usan el token guardado en `store/auth.js`.

```js
const authConfig = token => ({
  headers: { Authorization: `Bearer ${token}` }
})
```

Cuando una accion protegida necesita autenticacion, se llama asi:

```js
response = await axios.get(baseUrlUsers, authConfig(rootState.auth?.token))
```

Las rutas publicas de juegos no envian esta configuracion.

## `store/auth.js`

Gestiona registro, login, usuario actual y logout.

Estado:

```js
export const state = () => ({
  user: null,
  token: null,
  loading: false,
  error: null
})
```

### Login

```js
response = await axios.post(`${baseUrlAuth}/login`, credentials)
commit('SET_AUTH', response.data)
saveSession(response.data)
return response
```

Ruta usada:

```txt
POST /api/auth/login
```

El backend devuelve `user` y `token`. El store los guarda en Vuex y en `localStorage`.

### Registro

```js
response = await axios.post(`${baseUrlAuth}/register`, form)
```

Ruta usada:

```txt
POST /api/auth/register
```

### Usuario actual

```js
response = await axios.get(`${baseUrlAuth}/me`, authConfig(state.token))
commit('SET_USER', response.data.user)
```

Ruta usada:

```txt
GET /api/auth/me
```

### Logout

```js
await axios.post(`${baseUrlAuth}/logout`, {}, authConfig(state.token))
commit('CLEAR_AUTH')
clearSession()
```

Ruta usada:

```txt
POST /api/auth/logout
```

## `store/games.js`

Gestiona listado, detalle, actualizacion, activacion/desactivacion y eliminacion de juegos.

El store no cambia nombres. Guarda lo que recibe del backend:

```js
commit('SET_ITEMS', response.data.data)
```

### Obtener juegos

```js
response = await axios.get(baseUrlGames)
commit('SET_ITEMS', response.data.data)
return response
```

Ruta usada:

```txt
GET /api/games
```

### Obtener un juego

```js
response = await axios.get(`${baseUrlGames}/${gameId}`)
commit('SET_CURRENT', response.data.data)
return response
```

Ruta usada:

```txt
GET /api/games/{game}
```

### Actualizar juego

```js
response = await axios.post(`${baseUrlGames}/${game.id}`, game, authConfig(rootState.auth?.token))
commit('UPSERT_GAME', response.data.data)
return response
```

Ruta usada:

```txt
POST /api/games/{game}
```

El objeto `game` debe usar nombres del backend:

```js
{
  name: 'Juego',
  image: 'banner.png',
  isActive: true
}
```

### Activar o desactivar juego

```js
response = await axios.post(`${baseUrlGames}/${gameId}/toggle`, {}, authConfig(rootState.auth?.token))
commit('UPSERT_GAME', response.data.data)
return response
```

Ruta usada:

```txt
POST /api/games/{game}/toggle
```

### Eliminar juego

```js
response = await axios.delete(`${baseUrlGames}/${gameId}`, authConfig(rootState.auth?.token))
commit('REMOVE_GAME', gameId)
return response
```

Ruta usada:

```txt
DELETE /api/games/{game}
```

## `store/users.js`

Gestiona listado, detalle, actualizacion y eliminacion de usuarios.

Igual que `games.js`, no traduce nombres. Usa directamente `nickname`, `mail`, `level` e `isAdmin`.

### Obtener usuarios

```js
response = await axios.get(baseUrlUsers, authConfig(rootState.auth?.token))
commit('SET_ITEMS', response.data.data)
return response
```

Ruta usada:

```txt
GET /api/users
```

### Obtener un usuario

```js
response = await axios.get(`${baseUrlUsers}/${userId}`, authConfig(rootState.auth?.token))
commit('SET_CURRENT', response.data.data)
return response
```

Ruta usada:

```txt
GET /api/users/{user}
```

### Actualizar usuario

```js
response = await axios.post(`${baseUrlUsers}/${user.id}`, user, authConfig(rootState.auth?.token))
commit('UPSERT_USER', response.data.data)
return response
```

Ruta usada:

```txt
POST /api/users/{user}
```

El objeto `user` debe usar nombres del backend:

```js
{
  nickname: 'Usuario',
  mail: 'usuario@email.com',
  level: 12,
  isAdmin: false
}
```

### Eliminar usuario

```js
response = await axios.delete(`${baseUrlUsers}/${userId}`, authConfig(rootState.auth?.token))
commit('REMOVE_USER', userId)
return response
```

Ruta usada:

```txt
DELETE /api/users/{user}
```

## `store/user_games.js`

Este modulo deriva datos de ranking desde los juegos cargados en `store/games.js`.

Devuelve objetos con nombres en ingles:

```js
{
  id: game.id,
  name: game.name,
  rank: game.rank,
  score: game.best_score,
  time: game.best_time
}
```

`rank` queda marcado con un TODO en el codigo porque el backend todavia no calcula esa posicion.

## Uso desde paginas

Las paginas no llaman a Axios directamente. Llaman al store:

```js
await this.$store.dispatch('auth/login', {
  mail: this.mail,
  password: this.password
})
```

```js
await this.$store.dispatch('games/fetchAll')
```

```js
await this.$store.dispatch('users/fetchAll')
```

## Rutas del backend usadas

```txt
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/games
GET    /api/games/{game}
POST   /api/games/{game}
POST   /api/games/{game}/toggle
DELETE /api/games/{game}

GET    /api/users
GET    /api/users/{user}
POST   /api/users/{user}
DELETE /api/users/{user}
```

## Resumen

La conexion queda asi:

- El backend define los nombres de datos.
- El frontend usa esos mismos nombres.
- El store solo hace peticiones, guarda respuestas y actualiza estado.
- No hay capa de traduccion entre espanol e ingles dentro del store.
