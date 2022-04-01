exports = function() {
  /*
    A Scheduled Trigger will always call a function without arguments.
    Documentation on Triggers: https://docs.mongodb.com/realm/triggers/overview/

    Functions run by Triggers are run as System users and have full access to Services, Functions, and MongoDB Data.

    Access a mongodb service:
    const collection = context.services.get(<SERVICE_NAME>).db("db_name").collection("coll_name");
    const doc = collection.findOne({ name: "mongodb" });

    Note: In Atlas Triggers, the service name is defaulted to the cluster name.

    Call other named functions if they are defined in your application:
    const result = context.functions.execute("function_name", arg1, arg2);

    Access the default http client and execute a GET request:
    const response = context.http.get({ url: <URL> })

    Learn more about http client here: https://docs.mongodb.com/realm/functions/context/#context-http
  */
  const mongodb = context.services.get("Cluster0");
  const users = mongodb.db("<dbname>").collection("squashes");
  const DAYS = 1;
  const HOURS = 24;
  const MINUTES = 60;
  return users.updateMany(
    {
            "updatedAt" :
            { $lt: new Date((new Date().getTime() - (DAYS * HOURS * MINUTES * 60 * 1000))) } ,

    },
    { $set :{active: false}}, { timestamps: false}
  );
};
  //users.aggregate({
    //updatedAt: {
      ////$gte: new Date(new Date().getTime() - DAYS * 24 * 60 * 60 * 1000),
      //$gte: new Date(new Date().getTime() -  HOURS * 60 * 60 * 1000),
    //},
  //});

