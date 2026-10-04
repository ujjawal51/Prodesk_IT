import Input from './Input';
import { Search, Mail, KeyRound, Lock, User } from 'lucide-react';

/**
 * Storybook Configuration for Input Component
 * Tests field variants, validation states, helper text, and icons
 */
export default {
  title: 'Design System/Core/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', description: 'Field header label' },
    placeholder: { control: 'text', description: 'Placeholder guidance text' },
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'search', 'number'],
      description: 'HTML input type'
    },
    error: { control: 'text', description: 'Validation error feedback string' },
    helperText: { control: 'text', description: 'Informative subtitle' },
    disabled: { control: 'boolean', description: 'Disables editing' },
    required: { control: 'boolean', description: 'Appends required marker' }
  }
};

export const Default = {
  args: {
    placeholder: 'Enter engineering metric...'
  }
};

export const WithLabel = {
  args: {
    label: 'Deployment Cluster Name',
    placeholder: 'e.g. us-east-prod-matrix',
    required: true
  }
};

export const WithHelperText = {
  args: {
    label: 'WebSocket Handshake Timeout',
    placeholder: '5000',
    type: 'number',
    helperText: 'Configured in milliseconds. Range: 1000 - 15000ms.'
  }
};

export const SearchField = {
  args: {
    label: 'Audit Component Index',
    placeholder: 'Search UI modules, stories, or tokens...',
    icon: Search,
    type: 'search'
  }
};

export const PasswordField = {
  args: {
    label: 'Cluster Access Token',
    placeholder: 'Enter API secret key...',
    type: 'password',
    icon: Lock,
    helperText: 'Click the eye icon to toggle visibility.'
  }
};

export const ErrorState = {
  args: {
    label: 'Socket Gateway Port',
    placeholder: '5000',
    value: 'invalid_port_999999',
    error: 'Port number out of acceptable range (1024 - 65535)',
    icon: AlertCircle
  }
};

export const DisabledState = {
  args: {
    label: 'Read-Only Telemetry Node',
    value: 'node-ap-south-mumbai-01.prodesk.internal',
    disabled: true,
    helperText: 'Managed automatically by cluster orchestrator.'
  }
};
