import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Send,
  UserCircle,
  Heart,
  MessageCircle,
} from "lucide-react";
import UseBackend from "./functions/UseBackend";

const TruthSocialApp = () => {
  const [truths, setTruths] = useState([]);
  const [newTruth, setNewTruth] = useState("");
  const [category, setCategory] = useState("general");
  const [currentUser, setCurrentUser] = useState({ id: 1, username: "alice" });
  const [newComment, setNewComment] = useState("");
  const [commentingOn, setCommentingOn] = useState(null);

  useEffect(() => {
    fetchTruths();
  }, []);

  const fetchTruths = async () => {
    try {
      var truths = await UseBackend("GET", "truths");
      setTruths(truths);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (newTruth.length < 10 || newTruth.length > 300) {
      alert("Truth must be between 10 and 300 characters");
      return;
    }

    try {
      var data = await UseBackend("POST", "truth", {
        user_id: currentUser.id,
        content: newTruth,
        category,
      });
      setTruths([data, ...truths]);
      setNewTruth("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async truthId => {
    var data = await UseBackend("POST", `like/${truthId}`);
    setTruths(truths.map(truth => (truth.id === data.id ? data : truth)));
  };

  const handleComment = async truthId => {
    if (newComment.length < 1 || newComment.length > 100) {
      alert("Comment must be between 1 and 100 characters");
      return;
    }
    try {
      var data = await UseBackend("POST", "comment", {
        user_id: currentUser.id,
        truth_id: truthId,
        content: newComment,
      });
      setTruths(
        truths.map(truth =>
          truth.id === truthId
            ? { ...truth, comments: [...truth.comments, data] }
            : truth,
        ),
      );
      setNewComment("");
      setCommentingOn(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-blue-500 text-white p-4 text-center font-bold text-xl">
        Truth Social
      </header>

      <main className="flex-grow overflow-y-auto p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded-lg shadow mb-4"
        >
          <textarea
            value={newTruth}
            onChange={e => setNewTruth(e.target.value)}
            placeholder="Share a truth (10-300 characters)..."
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            rows="3"
          />
          <div className="flex justify-between items-center">
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="general">General</option>
              <option value="philosophy">Philosophy</option>
              <option value="science">Science</option>
              <option value="life">Life</option>
            </select>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded flex items-center"
            >
              <Send className="w-5 h-5 mr-2" /> Share Truth
            </button>
          </div>
        </form>

        {truths.map(truth => (
          <div key={truth.id} className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="flex items-center mb-2">
              <UserCircle className="w-8 h-8 text-gray-500 mr-2" />
              <span className="font-semibold">User {truth.user_id}</span>
            </div>
            <p className="text-gray-800 mb-2">{truth.content}</p>
            <div className="flex items-center text-gray-500 text-sm mb-2">
              <span className="mr-2">{truth.category}</span>
              <span>{truth.likes} likes</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleLike(truth.id)}
                className="text-pink-500 flex items-center"
              >
                <Heart className="w-5 h-5 mr-1" /> Like
              </button>
              <button
                onClick={() => setCommentingOn(truth.id)}
                className="text-blue-500 flex items-center"
              >
                <MessageCircle className="w-5 h-5 mr-1" /> Comment
              </button>
            </div>
            {commentingOn === truth.id && (
              <div className="mt-2">
                <textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Add a comment (1-100 characters)..."
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  rows="2"
                />
                <button
                  onClick={() => handleComment(truth.id)}
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Post Comment
                </button>
              </div>
            )}
            {truth.comments.length > 0 && (
              <div className="mt-2 border-t pt-2">
                <h4 className="font-semibold mb-1">Comments:</h4>
                {truth.comments.map(comment => (
                  <div key={comment.id} className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">User {comment.user_id}:</span>{" "}
                    {comment.content}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </main>

      <nav className="bg-white border-t flex justify-around p-4">
        <button className="text-blue-500">
          <UserCircle className="w-6 h-6" />
        </button>
        <button className="text-blue-500">
          <PlusCircle className="w-6 h-6" />
        </button>
      </nav>
    </div>
  );
};

export default TruthSocialApp;
