/**
*  ZombieManager schema
*
*  @version     0.0.1
*  @created     2016-02-19T00:35:44.714Z
*  @link        https://camintejs.com/
*  @wiki        https://github.com/biggora/caminte/wiki
*
*  Created by create-model script
**/

/**
*  Define  ZombieManager Model
*  @param  {Object}  schema
*  @return {Object}  model
*
*  @wiki   https://github.com/biggora/caminte/wiki/Defining-a-Model
**/
module.exports = function(schema){
    var ZombieManager = schema.define('zombie_pid', {
         pid: { type: schema.Number, limit: 10 },
         zombie_name: { type: schema.String, limit: 50 }
    },{


    });

    /**
    *  Define any custom method
    *  or setup validations here
    **/

    return ZombieManager;
};