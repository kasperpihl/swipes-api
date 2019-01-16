export default name =>
  decodeURIComponent(
    (new RegExp(`[?|&]${name}=` + '([^&;]+?)(&|#|;|$)').exec(
      location.search
    ) || [null, ''])[1].replace(/\+/g, '%20')
  ) || null;
