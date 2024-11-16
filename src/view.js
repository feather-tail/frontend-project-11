import onChange from "on-change";

const initView = (state, elements) => {
  const renderForm = () => {
    const { form, input } = elements;

    const existingFeedback = form.parentElement.querySelector(".feedback");
    if (existingFeedback) {
      existingFeedback.remove();
    }

    if (state.form.status === "success") {
      input.classList.remove("is-invalid");
      input.value = "";
      input.focus();
    } else if (state.form.status === "error") {
      input.classList.add("is-invalid");

      const feedback = document.createElement("p");
      feedback.classList.add(
        "feedback",
        "m-0",
        "position-absolute",
        "small",
        "text-danger"
      );
      feedback.textContent = state.form.error;

      form.parentElement.appendChild(feedback);
    }
  };

  const watchedState = onChange(state, (path) => {
    if (path.startsWith("form")) {
      renderForm();
    }
  });

  return watchedState;
};

export default initView;
