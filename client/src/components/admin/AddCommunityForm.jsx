import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCommunityAction, getCommunitiesAction } from "../../redux/actions/adminActions";

const AddCommunityForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    banner: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const communityError = useSelector((state) => state.admin?.communityError);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (!formData.name.trim()) {
      setError("Community name is required");
      setIsLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      setError("Description is required");
      setIsLoading(false);
      return;
    }

    if (formData.name.trim().length < 3) {
      setError("Community name must be at least 3 characters");
      setIsLoading(false);
      return;
    }

    if (formData.description.trim().length < 10) {
      setError("Description must be at least 10 characters");
      setIsLoading(false);
      return;
    }

    try {
      await dispatch(addCommunityAction(formData));
      setSuccess("Community created successfully!");
      setFormData({ name: "", description: "", banner: "" });

      // Refresh communities list
      setTimeout(() => {
        dispatch(getCommunitiesAction());
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to create community");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-md border p-6 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Add New Community</h2>

      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-sm">
          {success}
        </div>
      )}

      {communityError && (
        <div className="bg-red-100 text-red-800 p-3 rounded mb-4 text-sm">
          {communityError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Community Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Community Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Photography"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your community..."
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        {/* Banner URL (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Banner URL (Optional)
          </label>
          <input
            type="text"
            name="banner"
            value={formData.banner}
            onChange={handleChange}
            placeholder="/community-logos/custom.svg"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave empty to use default banner
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-2 rounded-md transition"
          >
            {isLoading ? "Creating..." : "Create Community"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 font-semibold py-2 rounded-md transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCommunityForm;
