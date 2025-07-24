// import userTypeDefs from './typeDefinitions/users';
// import userResolvers from './resolvers/users';
// import journeyTypeDefs from './typeDefinitions/journeys';
// import journeyResolvers from './resolvers/journeys';
// import moduleTypeDefs from './typeDefinitions/modules';
// import moduleResolvers from './resolvers/modules';
// import fromConfigTypeDefs from './typeDefinitions/from_configs';
// import fromConfigResolvers from './resolvers/from_configs';
// import channelTypeDefs from './typeDefinitions/channels';
// import channelResolvers from './resolvers/channels/';
// import editorTypeDefs from './typeDefinitions/editors';
// import editorResolvers from './resolvers/editors/';
// import protonTypeDefs from './typeDefinitions/proton';
// import protonResolvers from './resolvers/proton/';
// import configTypeDefs from './typeDefinitions/config';
// import configResolvers from './resolvers/config';
// import languageVariationResolvers from './resolvers/language_variations';
// import languageVariationTypeDefs from './typeDefinitions/language_variations';
// import contentEngineTypeDefs from './typeDefinitions/content-engine';
// import contentEngineResolvers from './resolvers/content_engine';
// import templateResolvers from './resolvers/templates';
// import templateTypeDefs from './typeDefinitions/templates';
// import weaponxResolvers from './resolvers/weaponx';
// import weaponxTypeDefs from './typeDefinitions/weaponx';
//
// const combinedTypeDefinitions = [
//   userTypeDefs,
//   journeyTypeDefs,
//   moduleTypeDefs,
//   fromConfigTypeDefs,
//   channelTypeDefs,
//   editorTypeDefs,
//   protonTypeDefs,
//   configTypeDefs,
//   languageVariationTypeDefs,
//   contentEngineTypeDefs,
//   templateTypeDefs,
//   weaponxTypeDefs,
// ];
//
// const combinedResolvers = {
//   ...journeyResolvers,
//   ...editorResolvers,
//   Query: {
//     ...userResolvers.Query,
//     ...journeyResolvers.Query,
//     ...fromConfigResolvers.Query,
//     ...channelResolvers.Query,
//     ...editorResolvers.Query,
//     ...protonResolvers.Query,
//     ...configResolvers.Query,
//     ...moduleResolvers.Query,
//     ...languageVariationResolvers.Query,
//     ...contentEngineResolvers.Query,
//     ...templateResolvers.Query,
//     ...weaponxResolvers.Query,
//   },
//   Mutation: {
//     ...userResolvers.Mutation,
//     ...journeyResolvers.Mutation,
//     ...fromConfigResolvers.Mutation,
//     ...channelResolvers.Mutation,
//     ...editorResolvers.Mutation,
//     ...protonResolvers.Mutation,
//     ...configResolvers.Mutation,
//     ...moduleResolvers.Mutation,
//     ...templateResolvers.Mutation,
//     ...weaponxResolvers.Mutation,
//   },
// };
//
// export const typeDefs = combinedTypeDefinitions;
// export const resolvers = combinedResolvers;
