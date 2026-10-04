import Button from './Button';
import { Send, Trash2, ArrowRight, Download, Sparkles } from 'lucide-react';

/**
 * Storybook Configuration for Button Component
 * Tracks component states, variants, sizes, and interactive controls
 */
export default {
  title: 'Design System/Core/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'danger', 'ghost'],
      description: 'Visual stylistic variant of the button'
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Dimensional padding and typographic scale'
    },
    isLoading: {
      control: 'boolean',
      description: 'Displays loading spinner and disables user interaction'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables button interactions and reduces opacity'
    },
    onClick: { action: 'clicked' }
  }
};

export const Primary = {
  args: {
    children: 'Deploy Service',
    variant: 'primary',
    size: 'md'
  }
};

export const Secondary = {
  args: {
    children: 'Audit Telemetry',
    variant: 'secondary',
    size: 'md'
  }
};

export const Outline = {
  args: {
    children: 'View Documentation',
    variant: 'outline',
    size: 'md'
  }
};

export const Danger = {
  args: {
    children: 'Terminate Gateway',
    variant: 'danger',
    size: 'md',
    icon: Trash2
  }
};

export const Ghost = {
  args: {
    children: 'Cancel Operation',
    variant: 'ghost',
    size: 'md'
  }
};

export const Small = {
  args: {
    children: 'Filter',
    size: 'sm',
    variant: 'secondary'
  }
};

export const Large = {
  args: {
    children: 'Initialize Production Pipeline',
    size: 'lg',
    variant: 'primary',
    icon: ArrowRight
  }
};

export const Loading = {
  args: {
    children: 'Connecting Gateway...',
    isLoading: true,
    variant: 'primary'
  }
};

export const Disabled = {
  args: {
    children: 'Permission Denied',
    disabled: true,
    variant: 'secondary'
  }
};

export const WithIcon = {
  args: {
    children: 'Download Artifacts',
    variant: 'primary',
    icon: Download
  }
};
