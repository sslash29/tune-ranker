function AccountSearch({ user, isAccountSelected }) {
  const { setShouldFetch, setUser } = useContext(AlbumSearchContext);
  function handleAccountSearchClick() {
    setShouldFetch(false);
    isAccountSelected(user);
    setUser(user);
    setActiveSection(null);
  }
  return (
    <div className="bg-[#333] p-2 rounded hover:bg-[#444] transition cursor-pointer flex items-center gap-3.5">
      <img
        src={user.avatarUrl || "/fallback-avatar.png"}
        alt="avatar"
        className="w-12 h-12 rounded-full object-cover mt-2"
      />
      <p className="text-lg font-bold">{user.username}</p>
    </div>
  );
}

export default AccountSearch;
