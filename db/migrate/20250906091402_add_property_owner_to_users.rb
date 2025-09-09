class AddPropertyOwnerToUsers < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :property_owner, :boolean, default: false, null: false
  end
end
