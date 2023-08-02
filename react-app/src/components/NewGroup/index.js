import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "./NewGroup.css";
import { createGroupThunk } from "../../store/groups";
import { getAllGroupsThunk } from "../../store/groups";

export default function NewGroup({ setCurrentView }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({})
    const dispatch = useDispatch();
    const history = useHistory();
    const [submitted, setSubmitted] = useState(false)
    const groups = useSelector((state) => state.groups.allGroups);
    
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
      await dispatch(createGroupThunk(formData))
      dispatch(getAllGroupsThunk());
      history.push(`/dashboard`);
      setCurrentView('dashboard');
    };
  
    return (
      <>
        <div className="add-group-form">
          <form onSubmit={handleSubmit}>
            <div className="formHeading">Add a new group</div>
            <div className="warning">FYI: you cannot delete a group if there are unsettled balances in the group.</div>
            <div className="longerFormContainer">
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
              Enter a description for your group.
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
                className="imageInputContainer"
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
            <div className="submit-container">
            <button type="submit" className="submit-form-button">
              Add your Group
            </button>
            </div>
          </form>
        </div>
      </>
    );
  }