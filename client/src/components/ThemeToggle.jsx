import { useTheme } from '../context/ThemeContext';
import { Button } from 'react-bootstrap';
import { BsSun, BsMoonFill } from 'react-icons/bs';

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <Button
      variant={darkMode ? "light" : "dark"}
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle theme"
    >
      {darkMode ? <BsSun className="theme-icon" /> : <BsMoonFill className="theme-icon" />}
    </Button>
  );
};

export default ThemeToggle;
