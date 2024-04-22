const LOAD_GROUPS = "groups/LOAD_GROUPS";
// const NEW_GROUP = "groups/NEW_GROUP";
// const UPDATE_GROUP = "groups/UPDATE_GROUP";
// const DELETE_GROUP = "groups/DELETE_GROUP";

const loadGroups = (groups) => ({
  type: LOAD_GROUPS,
  groups,
});
// const addOneGroup = (group) => ({
//   type: NEW_GROUP,
//   group,
// });
// const updateOneGroup = (group) => ({
//   type: UPDATE_GROUP,
//   group,
// });
// const deleteGroup = (group) => ({
//   type: DELETE_GROUP,
//   group,
// });

export const getAllGroups = () => async (dispatch) => {
  const response = await fetch(`/api/groups`);

  if (response.ok) {
    const groups = await response.json();
    const normalizedGroups = {};
    groups.Groups.forEach((group) => (normalizedGroups[group.id] = group));
    // const normalizedGroups = groups.Groups.reduce((acc, c) => {
    //   acc[c.id] = c;
    //   return acc;
    // });

    dispatch(loadGroups(normalizedGroups));
  } else {
    const errors = await response.json();
    console.log(errors);
    return errors;
  }
};
// export const createGroup = (newGroup) => async (dispatch) => {
//   const { name, about, type, private, city, state } = newGroup;

//   const response = await fetch(`/api/groups`, {
//     method: "POST",
//     body: JSON.stringify({
//       organizerId: user.id,
//       name,
//       about,
//       type,
//       private,
//       city,
//       state,
//     }),
//   });
// };

const initialState = {};

function groupsReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_GROUPS:
      return { ...state, ...action.groups };
    default:
      return state;
  }
}

export default groupsReducer;
