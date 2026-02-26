const isSidebarVisible = ref(true);

export const useSidebar = () => {
  const toggleSidebar = () => {
    isSidebarVisible.value = !isSidebarVisible.value;
  };

  return {
    isSidebarVisible: readonly(isSidebarVisible),
    toggleSidebar,
  };
};
