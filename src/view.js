import onChange from "on-change";

const initView = (state, elements) => {
  const renderForm = () => {
    const { form, input } = elements;

    const existingError = form.parentElement.querySelector(".error-field");
    if (existingError) {
      existingError.remove();
    }

    if (state.form.status === "success") {
      input.classList.remove("is-invalid");
      input.value = "";
      input.focus();
    } else if (state.form.status === "error") {
      input.classList.add("is-invalid");

      const errorField = document.createElement("p");
      errorField.classList.add(
        "error-field",
        "m-0",
        "position-absolute",
        "small",
        "text-danger"
      );
      errorField.textContent = state.form.error;

      form.parentElement.appendChild(errorField);
    }
  };

  const watchedState = onChange(state, (path) => {
    if (path.startsWith("form")) {
      renderForm();
    }
  });
  ыы;
  return watchedState;
};

export default initView;
