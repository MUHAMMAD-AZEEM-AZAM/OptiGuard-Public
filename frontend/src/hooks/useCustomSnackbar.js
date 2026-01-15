import { useSnackbar } from 'notistack';

const useCustomSnackbar = () => {
  const { enqueueSnackbar } = useSnackbar();

  const showSnackbar = (message, variant = 'info') => {
    enqueueSnackbar(message, {
      variant,
      // You can add additional default options here
      preventDuplicate: true,
    });
  };

  return {
    showSuccess: (message) => showSnackbar(message, 'success'),
    showError: (message) => showSnackbar(message, 'error'),
    showWarning: (message) => showSnackbar(message, 'warning'),
    showInfo: (message) => showSnackbar(message, 'info'),
  };
};

export default useCustomSnackbar; 