import onChange from "on-change";

const initView = (state, elements, i18n) => {
  const renderForm = () => {
    const { input, feedback } = elements;

    feedback.classList.remove("text-danger", "text-success");
    feedback.textContent = "";

    if (state.form.status === "success") {
      input.classList.remove("is-invalid");
      input.value = "";
      input.focus();
      feedback.classList.add("text-success");
      feedback.textContent = i18n.t("form.success");
    } else if (state.form.status === "error") {
      input.classList.add("is-invalid");
      feedback.classList.add("text-danger");
      feedback.textContent = i18n.t(state.form.error);
    }
  };

  const watchedState = onChange(state, (path) => {
    if (path === "form.status" || path === "form.error") {
      renderForm();
    }
  });

  return watchedState;
};

export default initView;
