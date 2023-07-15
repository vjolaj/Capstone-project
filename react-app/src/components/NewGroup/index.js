import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import "./NewGroup.css";
import { createGroupThunk, getAllGroupsThunk } from "../../store/groups";
import { getAllUsersThunk } from "../../store/users";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

export default function NewGroup() {
    const sessionUser = useSelector((state) => state.session.user);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({})
    const dispatch = useDispatch();
    const history = useHistory();
    const [submitted, setSubmitted] = useState(false)

  //   const users = useSelector(
  //     (state) => state.users.users
  //   )
  // // console.log(users)
  //   useEffect(() => {
  //       dispatch(getAllUsersThunk());
  //     }, [dispatch]);
  
  
    useEffect(() => {
      const errorsObject = {};
      if (!name) {
          errorsObject.name = "Name is required"
      }
      if (name.length > 255) {
         errorsObject.name = "Name can't be longer than 255 characters."
      }
      if (!description) {
          errorsObject.description = "Description is required"
      }
      if (description.length > 255) {
        errorsObject.description = "Description can't be longer than 255 characters."
      }
      if (!image) {
          errorsObject.image = "Image upload is required"
      }
    //   add validation error for image types
  
      setValidationErrors(errorsObject)
  }, [name, description, image])
  
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitted(true)
      const formData = new FormData();
      formData.append("group_name", name);
      formData.append("imageUrl", image);
      formData.append("description", description);
      // aws uploads can be a bit slow—displaying
      // some sort of loading message is a good idea
      setImageLoading(true);
      if (Object.values(validationErrors).length) {
        return null
    }
    setValidationErrors({})
      const newGroup = await dispatch(createGroupThunk(formData))
      newGroup && history.push(`/groups/${newGroup.id}`)
      // .then(() => {
      //   dispatch(getAllGroupsThunk());
      //   history.push(`/dashboard`);
      // });
    };
  
    return (
      <>
        <div className="add-group-form">
          <form onSubmit={handleSubmit}>
            {/* <ul>
                {errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul> */}
            <div className="formHeading">Add a new group</div>
            <div className="individualFormContainer">
              Enter a name for your group
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Group Name"
                className="input"
                />
                {submitted && validationErrors.name && <p className="error">{validationErrors.name}</p>}
            </div>
            
            <div className="longerFormContainer">
              Please enter a description for group.
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Group Description"
                className="input"
              />
              {submitted && validationErrors.description && <p className="error">{validationErrors.description}</p>}
            </div>
            <div className="form-input-box">
              <div
                className="imageInputContainer longerFormContainer"
                htmlFor="image"
              >
                Post an image for your group.
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                ></input>
                {submitted && validationErrors.image && <p className="error">{validationErrors.image}</p>}
  
              </div>
            </div>
            {/* <div>
              Add a member to your group:
              <input
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              ></input>
            </div> */}
            <button type="submit" className="submit-form-button">
              Add your Group
            </button>
          </form>
        </div>
      </>
    );
  }