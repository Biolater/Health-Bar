import UpdatePassword from "./UpdatePassword";
import DeleteAccount from "./DeleteAccount";
const AccountSettings = () => {
  return (
    <div className="flex flex-col w-full gap-4">
      <UpdatePassword />
      <DeleteAccount />
    </div>
  );
};

export default AccountSettings;
