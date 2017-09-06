export const NAVIGATION_HEIGHT = 60

export const NAVIGATION_CONTAINER = "NavigationContainer";
export const LEAD_DATA_PAGE_CONTAINER = "LeadDataPageContainer";
export const PERFORMANCE_PAGE_CONTAINER = "DashboardPageContainer";

export const DASHBOARD_PAGE_CONTAINER = "DashboardPageContainer";
export const DASHBOARD_PAGE_CONTAINER__COLUMN = "DashboardPageContainer__column";
export const DASHBOARD_PAGE_DASHBOARD_MEDIA_COMPONENT = "DashboardMediaComponent";
export const DASHBOARD_PAGE_UPLOAD_MEDIA_COMPONENT = "UploadMediaComponent";
export const DASHBOARD_PAGE_DASHBOARD_TEXT_CAPTION_COMPONENT = "DashboardTextCaptionComponent";
export const DASHBOARD_PAGE_DASHBOARD_PUBLISH_COMPONENT = "DashboardPublishComponent";

export const CALENDAR_COMPONENT = "CalendarComponent";
/*
Make sure the el has the @import css
*/


const makeAnimation = (el, classObject) => {
  const method = classObject.add ? "add" : "remove"
  return new Q((yes, no) => {

    if (!classObject.animation) {

      el.classList[method](classObject.class)

      if (classObject.transition) {
        setTimeout(() => {
          yes()
        }, classObject.delay || 0)
      } else {
        yes()
      }

    } else {

      let animationend = () => {
        el.removeEventListener('animationend', animationend);
        el.classList.remove(classObject.class)
        yes()
      }

      el.addEventListener("animationend", animationend, false);
      el.classList[method](classObject.class)
    }
  })
}

export const sequence = (el, animations) => {
  return Q.each(animations, anim => {
    return makeAnimation(el, anim)
  }, { concurrency: 1 })
}
