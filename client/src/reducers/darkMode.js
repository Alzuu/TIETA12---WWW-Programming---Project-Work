export function darkMode(state = false, action) {
  switch (action.type) {
    case 'TOGGLE_DARK_MODE':
      return action.toggled;
    default:
      return state;
  }
}
